#include <sys/time.h>
#include <ctime>
#include <iostream>
using namespace std;

class Time
{
private:
	long long start;
public:
	struct timeval tv;
	tm *ltm;
	int stamp;
public:
	Time();
	Time(time_t);
	~Time();
	void update();
	void update(bool);
	long get10();
	long long get13();
	long long get16();
	void begin();
	double ends();
	double endms();
	double endmin();
	short getyear();
	short getmouth();
	short getday();
	short gethour();
	short getminute();
	short getsecond();
	string normal();
	string normal(time_t);
	void settm(time_t);
	int operator-(Time &t);
};

Time::Time()
{
	settm(time(0));
	update(true);
}
Time::Time(time_t t)
{
	settm(t);
	update(true);
}

void Time::update()
{
	gettimeofday(&tv, NULL);
	stamp = tv.tv_sec;
}
void Time::update(bool notStamp)
{
	gettimeofday(&tv, NULL);
}
Time::~Time()
{

}
long Time::get10()
{
	return time(0);
}
long long Time::get13()
{
	update();
	return (long long)tv.tv_sec*1000 + tv.tv_usec/1000;
}
long long Time::get16()
{
	update();
	return (long long)tv.tv_sec*1000000 + tv.tv_usec;
}
void Time::begin()
{
	start = get16();
}

double Time::ends()
{
	update();
	long long current = (long long)tv.tv_sec*10 + tv.tv_usec/100000;
	return double(current - start/100000)/10;
}
double Time::endms()
{
	update();
	long long current = (long long)tv.tv_sec*1000 + tv.tv_usec/1000;
	return current - start/1000;
}
double Time::endmin()
{
	update();
	return double(time(NULL) - start/1000000)/60;
}

short Time::getyear()
{
	return 1900 + ltm->tm_year;
}
short Time::getmouth()
{
	return 1 + ltm->tm_mon;
}
short Time::getday()
{
	return ltm->tm_mday;
}
short Time::gethour()
{
	return ltm->tm_hour;
}
short Time::getminute()
{
	return ltm->tm_min;
}
short Time::getsecond()
{
	return ltm->tm_sec;
}
string Time::normal(time_t t)
{
	char* dt = ctime(&t);
	return dt;
}
string Time::normal()
{
	string m = to_string(getmouth());
	if ( m.length() == 1 ) m="0"+m;
	string d = to_string(getday());
	if ( d.length() == 1 ) d="0"+d;
	string h = to_string(gethour());
	if ( h.length() == 1 ) h="0"+h;
	string min = to_string(getminute());
	if ( min.length() == 1 ) min="0"+min;
	string s = to_string(getsecond());
	if ( s.length() == 1 ) s="0"+s;
	return "["+to_string(getyear())+"-"+m+"-"+d+" "+h+":"+min+":"+s+"]";
}
void Time::settm(time_t t)
{
  	stamp = t;
  	ltm = localtime(&t);
}
int Time::operator-(Time &t)
{
	return stamp - t.stamp;
}