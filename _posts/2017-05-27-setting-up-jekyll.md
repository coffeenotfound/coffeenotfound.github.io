---
title: "Setting-up Jekyll"
categories: Jekyll
---
Jekyll, the amazing [static website generator][jekyll site], can be a bit confusing to set-up and get running.
First impressions can deceive though, because it's actually quite easy!

<!-- endexcerpt -->

## Installing Ruby (and Git Bash)

Jekyll is built in Ruby, so the first thing we need to do is install a Ruby runtime. If you are on Windows,
I recommend the [RubyInstaller][rubyinstaller link] (not because it is inherently better than other distributions
but it makes the whole process pretty painless). Double click it and let it do it's thing.

We also need to be able to start Jekyll and tell it what to do. For that task I am using the [Git Bash][gitbash link]
(the one that comes with _Git for Windows_) which is essentially just a Bash shell. Of course you can use whatever shell you
desire, I just like Git Bash as I already use it for Git and it allows me to integrate the whole workflow a little
better, but tastes may very.


## Installing Jekyll

Once we have installed Ruby and have a shell the do our business in, we need to install Jekyll.
Open up your shell of choice and type in `gem install jekyll bundler`. This will install the bundler,
a kind of Ruby package manager thingy, and the Jekyll gem.

## Setting-up the Blog

Now that we have everything installed and ready to go we can actually set-up our blog.
A Jeklly blog, while generally pretty hassle-free, _does_ need some special care when setting up.
There's Bundler with it's `Gemfile`, the `Gemfile.lock` file, a config file, a theme and not even to mention
some sample content.

Luckily, Jekyll provides an easy way to get us where we want to be.
Navigate to the folder where you want the Blog to live locally (this would be your site's repo) and
run `jekyll new .`. This will create the blog files in the current directory.


## Configuring the Blog

Finally we have created our blog! Now we can start customizing it and writing blog posts. At this point
there is actually already some sample content on the blog so you can skip to the section about
[previewing](#previewing-the-blog) it if you would like to see what it already looks like.

## Previewing the Blog

Having access to the raw files is nice and dandy but how do we actually see what our blog looks like?
Running `bundle exec jekyll serve` starts a local server at port 4000 that hosts the blog so all we have to do now
is to type in `localhost:4000` into our browser and voilà, a blog!

By default Jekyll has "incremental build mode" activated so when we change a file the updates will be instantaniously
visible on our hosted blog! (Try it out, it's awesome!)

## Conclusion

As you can see setting up a Jekyll blog is a piece of cake! Not only that but a piece of yummy, moist cake.
Now all you have to do is go out there and write up some blog posts with weird and wonderful facts
that might indeed make the world a better place (with weirdly interesting facts).

[jekyll site]: https://jekyllrb.com/
[rubyinstaller link]: https://rubyinstaller.org/
[gitbash link]: https://git-for-windows.github.io/