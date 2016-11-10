#ifndef __PLUGIN_H__
#define __PLUGIN_H__

typedef struct avplay;
typedef struct ao_context;
typedef struct vo_context;
typedef struct source_context;
typedef struct SwsContext;
typedef struct _ZPlay
{
	struct avplay *m_avplay;//
	struct ao_context *m_audio;//音频渲染器
	struct vo_context *m_video;//视频渲染器
	struct source_context *m_source;//媒体源
	unsigned char* m_framebuffer;
	// 用于转换帧数据格式.
	struct SwsContext* m_swsctx;
	// 视频宽.
	int m_image_width;
	// 视频高.
	int m_image_height;
	// 是否启用宽高比.
	BOOL m_keep_aspect;
	// 宽高比.
	float m_window_aspect;
}*ZuiPlay, ZPlay;

__declspec(dllexport) ZuiPlay __stdcall ZPlayNew();
__declspec(dllexport) BOOL __stdcall ZPlayOpen(ZuiPlay p);
__declspec(dllexport) VOID __stdcall ZPlayStop(ZuiPlay p);
__declspec(dllexport) VOID __stdcall ZPlayStart(ZuiPlay p);
__declspec(dllexport) BOOL __stdcall ZPlayGetFFT(ZuiPlay p, float *power);
#endif // __PLUGIN_H__
