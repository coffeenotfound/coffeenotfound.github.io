---
title: Building GitHub Pages with Jekyll Plugins
---
As [GitHub Pages](https://pages.github.com/) does not allow custom Jekyll
plugins for extending your website, how can you bypass this restriction?
The answer is rather simple: Building it yourself!


## Repository Structure ##
Normally GitHub Pages does the website building for us, allowing us to
upload the site source straight into the repository. What we are
going to do is building the website ourself locally via the command line and
pushing the built website onto the `master` branch manually.

<figure id="figure-repo-structure">
	<img src="/assets/github-pages-repo-structure.png" alt="Repository Structure">
	<figcaption>Figure 1: The basic repository folder layout.</figcaption>
</figure>

In the above <a href="#figure-repo-structure">figure</a> you can see the basic layout.
The idea is that we have two branches: A `source` branch, containing all of the
source code, and a `master` branch, containing the final files of the built website.
_It is important that you create an empty `.nojekyll` file_ in the master branch (make sure to
add it to the `keep_files` list in the `_config.yml` or else it will disappear on the next site
build) to tell GitHub it shouldn't automatically build your site.


## Creating the Branches ##
I am going to assume you already have a `master` branch in your site's repo. Instead
of housing the source (as it probably does currently) it will become the build branch.

First create a new branch called `source` (or something similar) and copy the old source
over from the `master` branch (or create a new blog with `bundle exec jekyll new .`). Make sure the
`.gitignore` includes the `_site` folder.

Now go into the `_post folder` (create it or call `jekyll build` if you don't have one)
and clone the `master` branch into this folder (`git clone -b master https://github.com/<username>/<pages_repo>.git .`).
_It is important_ that you include `.git` in the `_config.yml`'s `keep_files` list!


## Building the Site ##
Now that everything is set up we can build the site.
This is easily done by calling `bundle exec jekyll build` (or `bundle exec jekyll serve` for
interactive building). Your site's source can now be uploaded by pushing the source branch to
upstream and the built site by `cd`'ing into the `_site` folder and doing a `git add .` before
pushing.

Because the `_site` folder (where the `master` branch lives) is ignored by the `source` branch
you can now traverse between them by simply `cd`'ing in and out of the `_site` folder. Please
keep in mind that you shouldn't `git checkout` other branches, though, as that might screw
something up.


## Advantages ##
Using the method described above allows you to use _any_ Jekyll plugin and basically do
pretty much _anything_ you like when building the site. In my opinion it is probably even
necessary for any site more complex than the most basic blog. Not everything is cakes
and rainbows, though.


## Disadvantages ##
It won't be possible anymore to just upload a blog post and have GitHub do everything
for you. Not only each architectural or design update of your blog or website but also every
new blog post will require you to rebuild the site locally and push all newly generated files upstream to GitHub.
While this is not a major hassle it is no doubt less elegant than the virgin GitHub Pages experience.
