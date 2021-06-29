#include <windows.h>

void __declspec(naked) nakedFun()
{
	asm(
		"pusha;"
		"pushf;"
		"push %%rbp;"
		"movq %%rsp, %%rbp;"
		"subq $0x20, %%rsp;"

		"addq $0x20, %%rsp;"
		"pop %%rbp;"
		);
	asm(
		"call getRip;"
		"jmp skip;"
		"goto:"
		"popa;"
		"popf;"
		"nop;"
		"nop;"
		"nop;"
		"nop;"
		"nop;"
		"skip:"
		);
	int *rip;
	asm(
		"jmp j;"
		"getRip:"
		"pop %0;"
		"j:"
		:"=r"(rip)
		);
	wind.jmp((LPVOID)((char*)rip+3), (LPCVOID)0x4046f7);
	asm(
		"jmp goto"
		);
}

void strand(HMODULE hModule)  
{
  	//HANDLE selfHandle = OpenProcess(PROCESS_ALL_ACCESS, 0, GetCurrentProcessId());
	
	
	
  	wind.jmp((LPVOID)0x4046f2, (LPCVOID)nakedFun);
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
