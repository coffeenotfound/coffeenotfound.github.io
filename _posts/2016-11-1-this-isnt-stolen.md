---
title: This isn't stolen...
tags: [C++, Character, String, Boost]
---
After I decided that it would be useful for me to have an OBJ parser in my pile of code. There is a lot of OBJ content kicking around, for example Morgan McGuire’s excellent data repository.
<!--more-->
OBJ is a text-based format, which means I’d need to write a parser, and 3D models are big, which means my parser shouldn’t be too slow. This got me thinking about the various options for tokenizing a string in C++, which led me to this StackOverflow thread.

This is __bold__. That is not the only thing that exists, though - _italic_ also looks cool. Links look like [this](https://www.google.com).

There are a variety of options mentioned. The objective of this post is to benchmark them. Let’s meet the contenders…

### Option 1: Boost ###

Lots of people like boost, and they have a nice, easy to use tokenizer (along with gobs and gobs of other things). Boost was the accepted answer on the StackOverflow article, and it is so popular that some commenters went so far as to declare that it is unreasonable not to assume it. Here is the boost tokenizer benchmark:

{% highlight c++ %}
void DoBoost( std::ofstream& cout, std::string& text )
{
    boost::char_separator<char> sep(" \n\t\r\f");
    boost::tokenizer<boost::char_separator<char>> tokens(text, sep);
    for (const auto& t : tokens) {
        cout << t ;
    }
}
{% endhighlight %}
I used boost 1.59.0 for this, built as per boost’s instructions.

### Option 2: Stream Iterators ###

Somebody else suggested using stream iterators, which I didn’t know were a thing. This lets us build a non-boost tokenizer using only standard library code. Here’s the original from the StackOverflow post:

{% highlight c++ %}
void DoIterator(std::ofstream& cout, std::string& str )
{
    // construct a stream from the string
    std::stringstream strstr(str);
 
    // use stream iterators to copy the stream to the vector as whitespace separated strings
    std::istream_iterator<std::string> it(strstr);
    std::istream_iterator<std::string> end;
    std::vector<std::string> results(it, end);
 
    // send the vector to stdout.
    std::ostream_iterator<std::string> oit(cout);
    std::copy(results.begin(), results.end(), oit);
}
{% endhighlight %}
Now, no offense to whoever wrote that, but, as we’ll see, sucking the entire token set into an std::vector of std::strings is, well, wrong 🙂 and would not have been a fair comparison. I modified it thusly:

{% highlight c++ %}
void DoIteratorCorrectly(std::ofstream& cout, std::string& str )
{
    // construct a stream from the string
    std::stringstream strstr(str);
 
    // use stream iterators to read individual strings
    std::istream_iterator<std::string> it(strstr);
    std::istream_iterator<std::string> end;
 
    std::for_each( it, end, [&cout]( const std::string& str ) { cout << str; } );
}
{% endhighlight %}

### Option 3: Strtok ###

Some grizzled veteran suggested strtok, and was predictably chided for suggesting a non-thread-safe, C-like solution. Somebody else pointed out that strtok needs a non-const pointer to a null-terminated string, which is not something you find lying around very often in C++. I’m not a big fan of strtok either but let’s give it whirl.

In order to make it non-destructive, we’ll even take a big hit and create our own mutable copy of the input string.

{% highlight c++ %}
void DoStrtok(std::ofstream& cout, std::string& str)
{
    char* pMutableString = (char*) malloc( str.size()+1 );
    strcpy( pMutableString, str.c_str() );
 
    char *p = strtok(pMutableString, " \n\t\r\f");
    while (p) {
        cout << p;
        p = strtok(NULL, " \n\t\r\f");
    }
    free(pMutableString);
}
{% endhighlight %}
To be fair, you couldn’t just copy the whole thing like that if you were streaming tokens from a very large on-disk file, but we could address this with a little more work by wrapping some streaming buffers around it.

### Option 4: Doing It Ourselves ###

Everybody always says you shouldn’t roll your own code for anything interesting, because the standard library’s always going to be faster and safer, but let’s ignore them. My home brew has a few disadvantages. It doesn’t handle UTF-8 or locales or any of those niceties, but it’s adequate for what I’m targeting it for, which is for parsing pure ascii files containing data that… really shouldn’t be ASCII encoded in the first place.

{% highlight c++ %}
static bool IsDelim( char tst )
{
    const char* DELIMS = " \n\t\r\f";
    do // Delimiter string cannot be empty, so don't check for it.  Real code should assert on it.
    {
        if( tst == *DELIMS )
            return true;
        ++DELIMS;
    } while( *DELIMS );
 
    return false;
}

void DoJoshsWay( std::ofstream& cout, std::string& str)
{
    char* pMutableString = (char*) malloc( str.size()+1 );
    strcpy( pMutableString, str.c_str() );
 
    char* p = pMutableString;
 
    // skip leading delimiters
    while( *p && IsDelim(*p) )
        ++p;
 
    while( *p )
    {
        // note start of token
        char* pTok = p;
 
        do// skip non-delimiters
        {
            ++p;
        } while( !IsDelim(*p) && *p );
 
        // clobber trailing delimiter with null
        *p = 0;
        cout << pTok; // send the token
 
        do // skip null, and any subsequent trailing delimiters
        {
            ++p;
        } while( *p && IsDelim(*p) );
    }
 
    free(pMutableString);
}
{% endhighlight %}

### Parameters ###

The contest shall be to tokenize the 20MB obj for ‘crytek_sponza’, which may be found here. I’m testing it by loading the entire file into memory ahead of time and tokenizing out of a string stream, then writing the resulting tokens back to disk. This lets me run multiple test cases back to back without having to worry about disk caching skewing the results. There is I/O on the other end, of course, but since my process never reads that stuff it shouldn’t interfere too much. Whatever noise there is should be evenly distributed amongst the test cases. Results presented are averages over five consecutive runs as measured by boost’s timer. My CPU is a Core i3-4010U. The code for the test is here. I compiled this for x86 with MSVC 2013 express edition. Here is the command line it used: