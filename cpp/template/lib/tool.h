#include <windows.h>
#include <iostream>
#include <vector>
// #include <TlHelp32.h>
// #include <thread>
#include <sys/time.h>
using namespace std;
class Tool
{
public:
    Tool();
    ~Tool();
    vector<string> split(string&, string);
    float random(int, int);
    char randStr();
    long long indexOf(const string &, string, bool);
    template<class T> char color(int, T);
    void strArrSub(string &, string, bool);
    int findKey(vector<string>&,  string);
};
Tool::Tool()
{
    struct timeval tv;
    gettimeofday(&tv, NULL);
    srand(tv.tv_usec);
}

Tool::~Tool()
{

}
vector<string> Tool::split(string &str, string pattern)
{
    vector<string> result;
    str += pattern;
    int size = str.size();
    for (int i = 0; i < size; i++)
    {
        int pos = str.find(pattern, i);
        if (pos < size)
        {
            string s = str.substr(i, pos - i);
            if ( s.length() ) result.push_back(s);
            i = pos + pattern.size() - 1;
        }
    }
    return result;
}
float Tool::random(int min=0, int max=1)
{
    return (float) rand() / RAND_MAX * (max-min)+min;
}
char Tool::randStr()
{
    return random(97, 123);
}
void Tool::strArrSub(string &path, string pattern, bool r=FALSE)
{
    vector<string> dir = split(path, pattern);
    path.replace(indexOf(path, dir[dir.size()-1], r), path.size(), "");
}
long long Tool::indexOf(const string &s, string pattern, bool r=FALSE)
{
    long long result = -1;
    if ( r )
    {
        for (int i = s.size()-1; i >= pattern.size()-1 ; --i)
        {
            string curr = s.substr(i, pattern.size());
            if ( curr == pattern )
            {
                result = i;
                break;
            }
        }    
    } else {
        for (int i = 0; i < s.size()-pattern.size()+1; ++i)
        {
            string curr = s.substr(i, pattern.size());
            if ( curr == pattern )
            {
                result = i;
                break;
            }
        }
    }
    return  result;
}

template<class T> char Tool::color(int n, T t)
{
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), n);
    t();
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 7);
    return {0};
}
int Tool::findKey(vector<string>& vec,  string key)
{
    for (int i = 0; i < vec.size(); ++i)
    {
        if ( vec[i] == key ) return i;
    }
    return -1;
}
// 打开进程
    // HANDLE handle = OpenProcess(PROCESS_ALL_ACCESS, false, 2224);
    // 关闭进程
    // TerminateProcess(handle, 0);
    // 遍历进程
    // HANDLE handle = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
    // PROCESSENTRY32W processEntry = {sizeof(PROCESSENTRY32W)};
    // bool success = Process32FirstW(handle, &processEntry);

    // if ( success )
    // {
    //  do
    //  {
    //      if ( wcscmp(processEntry.szExeFile, L"System") == 0 )
    //      {
    //          cout << "yes" << endl;
    //          break;
    //      }
    //      wcout << "ID: " << processEntry.th32ProcessID << "\t" << "name: " << processEntry.szExeFile << endl;
    //  } while ( Process32NextW(handle, &processEntry) );
        
    // }

    // 遍历模块
    // HANDLE handle = CreateToolhelp32Snapshot(TH32CS_SNAPMODULE, 1092); //进程ID
    // MODULEENTRY32W moduleEntry = {sizeof(MODULEENTRY32W)};
    // bool success = Module32FirstW(handle, &moduleEntry);

    // if ( success )
    // {
    //  do
    //  {
    //      wcout << "module path: " << moduleEntry.szExePath << endl;
    //  } while ( Module32NextW(handle, &moduleEntry) );
        
    // }

    //启动线程
    // thread t(fun);
    // t.join();
    // t.detach();

    
    
    



//文本转整数 cahr类型atoi
    // string n = "1";
    // cout <<  stoi(n) + stoi(n) << endl;

    // char n[20];
    // strcpy(n, "123");
    // cout << atoi(n)+1 << endl;
    
    //数字转文本
    // char str[255] = {0};
    // itoa(15, str, 10);
    // string str1;
    // str1 = str;
    // cout << str1 +"b" << endl;

    //const char *c_str(); 
    //c_str()函数返回一个指向正规C字符串的指针常量, 内容与本string串相同. 
    //这是为了与c语言兼容，在c语言中没有string类型，故必须通过string类对象的成员函数c_str()把string 对象转换成c中的字符串样式。
    // char *c = new char[255];
    // string s = "1234";
    // strcpy(c, s.c_str());
    // delete c;