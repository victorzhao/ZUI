#include "jsi.h"
#include "jsparse.h"
#include "jscompile.h"
#include "jsvalue.h"
#include "jsbuiltin.h"

static void jsB_Function(js_State *J)
{
	int i, top = js_gettop(J);
	js_Buffer *sb = NULL;
	const wchar_t *body;
	js_Ast *parse;
	js_Function *fun;

	/* p1, p2, ..., pn */
	if (top > 2) {
		for (i = 1; i < top - 1; ++i) {
			if (i > 1)
				js_putc(J, &sb, ',');
			js_puts(J, &sb, js_tostring(J, i));
		}
		js_putc(J, &sb, ')');
	}

	/* body */
	body = js_isdefined(J, top - 1) ? js_tostring(J, top - 1) : L"";

	if (js_try(J)) {
		js_free(J, sb);
		jsP_freeparse(J);
		js_throw(J);
	}

	parse = jsP_parsefunction(J, L"[string]", sb ? sb->s : NULL, body);
	fun = jsC_compilefunction(J, parse);

	js_endtry(J);
	js_free(J, sb);
	jsP_freeparse(J);

	js_newfunction(J, fun, J->GE);
}

static void jsB_Function_prototype(js_State *J)
{
	js_pushundefined(J);
}

static void Fp_toString(js_State *J)
{
	js_Object *self = js_toobject(J, 0);
	wchar_t *s;
	int i, n;

	if (!js_iscallable(J, 0))
		js_typeerror(J, L"not a function");

	if (self->type == JS_CFUNCTION || self->type == JS_CSCRIPT) {
		js_Function *F = self->u.f.function;
		n = wcslen(L"function () { ... }");
		n += wcslen(F->name);
		for (i = 0; i < F->numparams; ++i)
			n += wcslen(F->vartab[i]) + 1;
		s = js_malloc(J, (n + 1)*sizeof(wchar_t));
		wcscpy(s, L"function ");
		wcscat(s, F->name);
		wcscat(s, L"(");
		for (i = 0; i < F->numparams; ++i) {
			if (i > 0) wcscat(s, ",");
			wcscat(s, F->vartab[i]);
		}
		wcscat(s, L") { ... }");
		if (js_try(J)) {
			js_free(J, s);
			js_throw(J);
		}
		js_pushstring(J, s);
		js_free(J, s);
		js_endtry(J);
	} else {
		js_pushliteral(J, L"function () { ... }");
	}
}

static void Fp_apply(js_State *J)
{
	int i, n;

	if (!js_iscallable(J, 0))
		js_typeerror(J, L"not a function");

	js_copy(J, 0);
	js_copy(J, 1);

	if (js_isnull(J, 2) || js_isundefined(J, 2)) {
		n = 0;
	} else {
		n = js_getlength(J, 2);
		for (i = 0; i < n; ++i)
			js_getindex(J, 2, i);
	}

	js_call(J, n);
}

static void Fp_call(js_State *J)
{
	int i, top = js_gettop(J);

	if (!js_iscallable(J, 0))
		js_typeerror(J, L"not a function");

	for (i = 0; i < top; ++i)
		js_copy(J, i);

	js_call(J, top - 2);
}

static void callbound(js_State *J)
{
	int top = js_gettop(J);
	int i, fun, args, n;

	fun = js_gettop(J);
	js_currentfunction(J);
	js_getproperty(J, fun, L"__TargetFunction__");
	js_getproperty(J, fun, L"__BoundThis__");

	args = js_gettop(J);
	js_getproperty(J, fun, L"__BoundArguments__");
	n = js_getlength(J, args);
	for (i = 0; i < n; ++i)
		js_getindex(J, args, i);
	js_remove(J, args);

	for (i = 1; i < top; ++i)
		js_copy(J, i);

	js_call(J, n + top - 1);
}

static void constructbound(js_State *J)
{
	int top = js_gettop(J);
	int i, fun, args, n;

	fun = js_gettop(J);
	js_currentfunction(J);
	js_getproperty(J, fun, L"__TargetFunction__");

	args = js_gettop(J);
	js_getproperty(J, fun, L"__BoundArguments__");
	n = js_getlength(J, args);
	for (i = 0; i < n; ++i)
		js_getindex(J, args, i);
	js_remove(J, args);

	for (i = 1; i < top; ++i)
		js_copy(J, i);

	js_construct(J, n + top - 1);
}

static void Fp_bind(js_State *J)
{
	int i, top = js_gettop(J);
	int n;

	if (!js_iscallable(J, 0))
		js_typeerror(J, L"not a function");

	n = js_getlength(J, 0);
	if (n > top - 2)
		n -= top - 2;
	else
		n = 0;

	/* Reuse target function's prototype for HasInstance check. */
	js_getproperty(J, 0, L"prototype");
	js_newcconstructor(J, callbound, constructbound, L"[bind]", n);

	/* target function */
	js_copy(J, 0);
	js_defproperty(J, -2, L"__TargetFunction__", JS_READONLY | JS_DONTENUM | JS_DONTCONF);

	/* bound this */
	js_copy(J, 1);
	js_defproperty(J, -2, L"__BoundThis__", JS_READONLY | JS_DONTENUM | JS_DONTCONF);

	/* bound arguments */
	js_newarray(J);
	for (i = 2; i < top; ++i) {
		js_copy(J, i);
		js_setindex(J, -2, i - 2);
	}
	js_defproperty(J, -2, L"__BoundArguments__", JS_READONLY | JS_DONTENUM | JS_DONTCONF);
}

void jsB_initfunction(js_State *J)
{
	J->Function_prototype->u.c.function = jsB_Function_prototype;
	J->Function_prototype->u.c.constructor = NULL;

	js_pushobject(J, J->Function_prototype);
	{
		jsB_propf(J, L"Function.prototype.toString", Fp_toString, 2);
		jsB_propf(J, L"Function.prototype.apply", Fp_apply, 2);
		jsB_propf(J, L"Function.prototype.call", Fp_call, 1);
		jsB_propf(J, L"Function.prototype.bind", Fp_bind, 1);
	}
	js_newcconstructor(J, jsB_Function, jsB_Function, L"Function", 1);
	js_defglobal(J, L"Function", JS_DONTENUM);
}
