#include <windows.h>
#include <iostream>
#include <vector>
#include <TlHelp32.h>

using namespace std;

class Wind
{
public:
	Wind();
	~Wind();
	
	vector<wstring> eachModule(const int &);
	void eachProcess(wstring, vector<DWORD> &);
	
	DWORD getId(wstring);
	DWORD getPid(wstring);
	DWORD getPid(string);
	HANDLE getProcess(wstring, DWORD);
	HANDLE getProcess(string, DWORD);
	void injectDll(const string &, wstring, DWORD);
	void injectDll(const string &, string, DWORD);
	void jmp(LPVOID, LPCVOID);
};
Wind::Wind()
{
	
}

Wind::~Wind()
{

}



void Wind::eachProcess(wstring t, vector<DWORD> &results)
{
	// 遍历进程
	HANDLE handle = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
	PROCESSENTRY32W processEntry = {sizeof(PROCESSENTRY32W)};
	bool success = Process32FirstW(handle, &processEntry);
	if ( success )
	{
		do
		{
			//if ( wcscmp(processEntry.szExeFile, L"System") == 0 )
			if ( wcscmp(processEntry.szExeFile, t.c_str()) == 0 )
			{
				results.push_back(processEntry.th32ProcessID);
			}
		} while ( Process32NextW(handle, &processEntry) );
	}
}
vector<wstring> Wind::eachModule(const int &id)
{
	// 遍历模块
	HANDLE handle = CreateToolhelp32Snapshot(TH32CS_SNAPMODULE, id);
	MODULEENTRY32W moduleEntry = {sizeof(MODULEENTRY32W)};
	bool success = Module32FirstW(handle, &moduleEntry);
	vector<wstring> str;
	if ( success )
	{
		do
		{
			str.push_back(moduleEntry.szExePath);
		} while ( Module32NextW(handle, &moduleEntry) );
	}
	return str;
}
DWORD Wind::getId(wstring name)
{
	vector<DWORD> d;
	eachProcess(name, d);
	return d[0];
}

DWORD Wind::getPid(wstring name)
{
	HWND hwnd = FindWindowW(NULL, name.c_str());
	DWORD pid;
	GetWindowThreadProcessId(hwnd, &pid);
	return DWORD(pid);
}
DWORD Wind::getPid(string name)
{
	HWND hwnd = FindWindow(NULL, name.c_str());
	DWORD pid;
	GetWindowThreadProcessId(hwnd, &pid);
	return DWORD(pid);
}

HANDLE Wind::getProcess(string name, DWORD pid=0)
{
	if ( pid == 0 ) pid = getPid(name);
	cout << pid << endl;
	OpenProcess(PROCESS_ALL_ACCESS, FALSE, pid);
	return OpenProcess(PROCESS_ALL_ACCESS, FALSE, pid);
}
HANDLE Wind::getProcess(wstring name, DWORD pid=0)
{
	if ( pid == 0 ) pid = getPid(name);
	OpenProcess(PROCESS_ALL_ACCESS, FALSE, pid);
	return OpenProcess(PROCESS_ALL_ACCESS, FALSE, pid);
}

void Wind::injectDll(const string &path, string name, DWORD pid=0)
{
	string dllPath = path;
	DWORD buffSize = dllPath.length() + 1;
	SIZE_T realWrite = 0;

	if ( pid == 0 ) pid = getPid(name);

	//1打开目标进程
	HANDLE hProcess = OpenProcess(PROCESS_ALL_ACCESS, FALSE, pid);
	//2申请远程内存空间
	LPVOID allocAddress = VirtualAllocEx(hProcess, 0, buffSize, MEM_COMMIT, PAGE_READWRITE);
	//3将dll文件路径写入到内存
	BOOL bsuccess = WriteProcessMemory(hProcess, allocAddress, dllPath.c_str(), buffSize, &realWrite);
	//4创建远程线程
	HANDLE hThread = CreateRemoteThread(hProcess, 0, 0, (LPTHREAD_START_ROUTINE)LoadLibraryA, allocAddress, 0, 0);
	
	WaitForSingleObject(hThread, -1);
	VirtualFreeEx(hProcess, allocAddress, 0, MEM_RELEASE);
	
	CloseHandle(hThread);
	CloseHandle(hProcess);
}
void Wind::injectDll(const string &path, wstring name, DWORD pid=0)
{
	string dllPath = path;
	DWORD buffSize = dllPath.length() + 1;
	SIZE_T realWrite = 0;
	if ( pid == 0 ) pid = getPid(name);

	//1打开目标进程
	HANDLE hProcess = OpenProcess(PROCESS_ALL_ACCESS, FALSE, pid);
	//2申请远程内存空间
	LPVOID allocAddress = VirtualAllocEx(hProcess, 0, buffSize, MEM_COMMIT, PAGE_READWRITE);
	//3将dll文件路径写入到内存
	BOOL bsuccess = WriteProcessMemory(hProcess, allocAddress, dllPath.c_str(), buffSize, &realWrite);
	//4创建远程线程
	HANDLE hThread = CreateRemoteThread(hProcess, 0, 0, (LPTHREAD_START_ROUTINE)LoadLibraryA, allocAddress, 0, 0);
	
	WaitForSingleObject(hThread, -1);
	VirtualFreeEx(hProcess, allocAddress, 0, MEM_RELEASE);
	
	CloseHandle(hThread);
	CloseHandle(hProcess);
}

void Wind::jmp(LPVOID hookAddr, LPCVOID hookFun)
{

	BYTE hookCode[5] = { 0XE9, 0x00, 0X00, 0X00, 0X00 };

	LPVOID offset;
 	asm("subq %%rcx, %%rax ;""leaq -5(%%rax), %0":"=r"(offset):"a"(hookFun), "c"(hookAddr));
 	memcpy(&hookCode[1], &offset, 4);

	//自己窗口的句柄
  	HANDLE h = OpenProcess(PROCESS_ALL_ACCESS, 0, GetCurrentProcessId());

	DWORD oldProtect = 0;
	// 读写权限修改
	VirtualProtectEx(h, hookAddr, sizeof(hookCode), PAGE_EXECUTE_READWRITE, &oldProtect);
	//修改内存
	WriteProcessMemory(h, hookAddr, &hookCode, sizeof(hookCode), NULL);
	// 改回原来的权限
	VirtualProtectEx(h, hookAddr, sizeof(hookCode), oldProtect, &oldProtect);

	CloseHandle(h);
}

// int main(int argc, char const *argv[])
// {
// 	DWORD attFun = 0X41FD40;
// 	HANDLE hProcess = wind.getProcess("Sword2 Window");

// 	BYTE hookCode[8] = { 0XE9, 0x00, 0X00, 0X00, 0X00 , 0X90, 0X90, 0X90};

// 	BYTE allocFun[] = { 0X56, 0X8B, 0XF1, 0X57, 0X81, 0X7E, 0X04, 0X02, 0X00, 0X00, 0X00, 0X75, 0X08, 0XC7, 0X44, 0X24, 0X0C, 0X00, 0X00, 0X00, 0X00, 0XE9, 0X00, 0X00, 0X00, 0X00 };
// 	cout << hProcess << endl;

// 	LPVOID allocAddr = VirtualAllocEx(hProcess, 0, 0x100, MEM_COMMIT, PAGE_EXECUTE_READWRITE);
	
// 	LPVOID offset;
// 	asm(
// 		"subq %%rcx, %%rax\n"
// 		"leaq (%%rax), %0"
// 		: "=r"(offset)
// 		: "a"(allocAddr), "c"(attFun+5)
// 	);
// 	memcpy(&hookCode[1], &offset, 4);

// 	DWORD oldProtect = 0;
// 	// 读写权限修改
// 	VirtualProtectEx(hProcess, reinterpret_cast<LPVOID>(attFun), 8, PAGE_EXECUTE_READWRITE, &oldProtect);
// 	//修改内存
// 	WriteProcessMemory(hProcess, reinterpret_cast<LPVOID>(attFun), &hookCode, 8, NULL);
// 	// 改回原来的权限
// 	VirtualProtectEx(hProcess, reinterpret_cast<LPVOID>(attFun), 8, oldProtect, &oldProtect);


// 	// 在新开辟的内存空间里面， 实现逻辑
// 	LPVOID offset2;
// 	asm(
// 		"subq %%rcx, %%rax\n"
// 		"leaq (%%rax), %0"
// 		: "=r"(offset2)
// 		: "a"(attFun+8), "c"((BYTE*)allocAddr+21+5)
// 	);

// 	memcpy(&allocFun[22], &offset2, 4);
// 	WriteProcessMemory(hProcess, allocAddr, allocFun, sizeof(allocFun), NULL);

// 	return 0;
// }


// void  autoHP()
// {
// 	DWORD* hp = (DWORD*)(0X4CEF18);
// 	while (1)
// 	{
// 		if (*hp <= 500)
// 		{
// 			asm("pushq $0x52");
// 			asm("movl $0x537400, %ecx");
// 			asm("movl $0x004252E0, %eax"); 
// 			asm(".code32");
// 			asm("call *%eax");
// 			asm(".code64");
// 		}
// 	}
// }

// int main(int argc, char const *argv[])
// {
// 	HANDLE hProcess = wind.getProcess("Sword2 Window");

// 	LPVOID  lpAllocAddr = VirtualAllocEx(hProcess, 0, 0x100, MEM_COMMIT, PAGE_EXECUTE_READWRITE);
// 	cout << lpAllocAddr << endl;
	
// 	WriteProcessMemory(hProcess, lpAllocAddr, (LPCVOID)autoHP, 0x100, NULL);
// 	HANDLE hThread = CreateRemoteThread(hProcess, NULL, 0, (LPTHREAD_START_ROUTINE)lpAllocAddr, 0, 0, 0);
// 	return 0;
// }