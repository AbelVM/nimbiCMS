# Using GitHub Pages fully online

This quickstart guide will help you set up a blog, knowledge base, or cookbook using only the [GitHub](https://github.com) web interface.

You will need some basic knowledge about [GitHub-flavored Markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax).

## Create a free GitHub account

Obviously :sweat_smile:

For the sake of this tutorial, let's say that your GitHub user name is `username`.

## Create your repository

Once logged in, click the **New** button near the top-left of the page, next to the repositories search box.

Follow the instructions and make your repository **public** so you can use it to host your new content site.

For the sake of this tutorial, let's say that your GitHub repository is called `repositoryname`.

So, now you should have a repository URL like `https://github.com/username/repositoryname`.

## The scaffolding

Now you will need some structure there.

Let's use a folder for your articles. For the sake of this tutorial, let's say that the folder is called `content`. To do so using the web interface, you need to create your first article. Let's call it `home` and we'll make it your home page later.

Click the button **Add file** and select **Create new file**, or just browse to `https://github.com/username/repositoryname/new/main`.

In the **Name your file...** input, just type `content/home.md`. You can then add some text there:

```markdown
# Welcome to repositoryname!

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
est laborum.

```

You can use the **Preview** button to check the results.

Ok, now you need some more files there.

### The navigation

You need to define the links that will appear in the top navigation bar. To do so, create a markdown file in the `content` folder. Let's call it `_navigation.md` (the leading underscore is important — it tells nimbiCMS this is a special file).

Follow the same steps that you followed to create your homepage, but the contents will be something like:

```markdown
[home](home.md)
[Cook Book](recipes.md)
[About](about.md)

```

All those lines are markdown links to files in the `content` folder. You can use subfolders, but you can't point outside the `content` folder. The first line is special — it defines the home page.

Now, to follow this tutorial, you should create both `recipes.md` and `about.md` and fill them with the content you'd like.

### The "Not Found" page

Now you need to create a page to show when someone visits a URL that does not exist. Let's call it `_404.md` (404 is the standard HTTP error code for "not found"). You should put some friendly message there, like:

```markdown

# Page not found

Not all who wander are lost.

But you're definitely lost.

```

### The Jekyll override

[Jekyll](https://github.com/jekyll/jekyll) is a simple, blog-aware, static site generator and is the default engine behind GitHub Pages. The problem is that if you want to use **nimbiCMS** in GitHub Pages and any of your files start with an underscore (for example `_navigation.md` or `_404.md`), GitHub's Jekyll processor will ignore them by default.

Add an empty `.nojekyll` file at the repository root to disable Jekyll in your repository so those files are served.

## Set up the web page

In the root folder of your repository, create a file called exactly `index.html` and paste this code:

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>My Content Site</title>
  <style>
    html,
    body,
    #app {
      height: 100vh;
      max-height: 100vh;
      margin: 0;
      display: block;
    }
  </style>
  <link rel="preload" href="https://unpkg.com/nimbi-cms/dist/nimbi-cms.css" as="style" onload="this.rel='stylesheet'">
  <noscript>
    <link rel="stylesheet" href="https://unpkg.com/nimbi-cms/dist/nimbi-cms.css">
  </noscript>
</head>

<body>
  <div id="app"></div>

  <script src="https://unpkg.com/nimbi-cms/dist/nimbi-cms.js" defer></script>

  <script defer>
        nimbiCMS.initCMS({
          el: '#app',
          contentPath: './content',
          homePage: 'home.md',
          notFoundPage: '_404.md',
          navigationPage: '_navigation.md',
          indexDepth: 3,
          defaultStyle: 'light'
        });
  </script>
</body>

</html>

```

The code above renders a site with nimbiCMS default styling. You can visit the [playground](playground.html) and play with the styling. Once you have found a styling combination you like, you can customize the theme using the options documented in the main [README](../README.md).

You should change the title from `My Content Site` to the title of your choice.

## Enable GitHub Pages

Let's publish the site.

You need to enable **Pages** in your repository settings. To do so, click on the **Settings** gear icon and then **Pages** on the right menu, or just go to `https://github.com/username/repositoryname/settings/pages`

- **Build and deployment**: `Deploy from a branch`
- **Branch**: `main` and press **Save**

That's it!

## Enjoy

Your new content site is now published at `https://username.github.io/repositoryname`

Now you can add and fine-tune your site. There are lots of options. Just check the main [README](../README.md) for further info on customizing.
