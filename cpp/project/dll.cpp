#include <windows.h>
void strand(HMODULE hModule)  
{
  	//MessageBox(0, "in", 0,0);




    //FreeLibraryAndExitThread(hModule, 0);
}

BOOL APIENTRY DllMain(HMODULE hModule, DWORD  ul_reason_for_call, LPVOID lpReserved)
{
	switch (ul_reason_for_call)
	{
	case DLL_PROCESS_ATTACH:
	 	CloseHandle(CreateThread(NULL, 0, (LPTHREAD_START_ROUTINE)strand, hModule, 0, NULL));
		break;
	case DLL_THREAD_ATTACH:
		break;
	case DLL_THREAD_DETACH:
		break;
	case DLL_PROCESS_DETACH:
		break;
	}
	return TRUE;
}
