#include <windows.h>
#include <iostream>
#include <vector>
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
	long long indexOf(const string &, string);
	template<class T> char color(int, T);
	string wstrToStr(wstring);
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

long long Tool::indexOf(const string &s, string pattern)
{
	return s.find(pattern);
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
string Tool::wstrToStr(wstring wstr)
{
    string result;
    //获取缓冲区大小，并申请空间，缓冲区大小事按字节计算的
    int len = WideCharToMultiByte(CP_ACP, 0, wstr.c_str(), wstr.size(), NULL, 0, NULL, NULL);
    char* buffer = new char[len + 1];
    //宽字节编码转换成多字节编码
    WideCharToMultiByte(CP_ACP, 0, wstr.c_str(), wstr.size(), buffer, len, NULL, NULL);
    buffer[len] = '\0';
    //删除缓冲区并返回值
    result.append(buffer);
    delete[] buffer;
    return result;
}

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