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
	void injectDll(const string&, int);
	vector<wstring> eachModule(const int &);
	int eachProcess(wstring);
};
Wind::Wind()
{
	
}

Wind::~Wind()
{

}
void Wind::injectDll(const string &path, int pid)
{
	//string dllPath = "D:\\object\\day1\\app.dll";
	string dllPath = path;
	DWORD buffSize = dllPath.length() + 1;
	SIZE_T realWrite = 0;
	//1打开目标进程
	HANDLE hProcess = OpenProcess(PROCESS_ALL_ACCESS, FALSE, pid);
	//2申请远程内存空间
	char * str = (char*)VirtualAllocEx(hProcess, 0, buffSize, MEM_COMMIT, PAGE_READWRITE);
	//3将dll文件路径写入到内存
	BOOL bsuccess = WriteProcessMemory(hProcess, str, dllPath.c_str(), buffSize, &realWrite);
	//4创建远程线程
	HANDLE hThread = CreateRemoteThread(hProcess, 0, 0, (LPTHREAD_START_ROUTINE)LoadLibraryA, str, 0, 0);
	
	WaitForSingleObject(hThread, -1);
	VirtualFreeEx(hProcess, str, 0, MEM_RELEASE);
	
	CloseHandle(hThread);
	CloseHandle(hProcess);
}

int Wind::eachProcess(wstring t)
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
				return (int)processEntry.th32ProcessID;
			}
		} while ( Process32NextW(handle, &processEntry) );
	}
	return 0;
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

// 打开进程
// HANDLE handle = OpenProcess(PROCESS_ALL_ACCESS, false, 2224);
// 关闭进程
// TerminateProcess(handle, 0);
	