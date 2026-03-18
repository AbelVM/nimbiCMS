# Using GitHub pages fully online

This quickstart guide will help you set up a blog, knowledge base or your cookbook using only [GitHub](https://github.com) web interface.

You will need some basic knwoledge about [GitHub‑flavored Markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)

## Create a free user in GitHub

Obviously :sweat_smile:

For the sake of this tutorial, let's say that your GitHub user name is `username`

## Create your repository

Once within your account click the `New` button in the left area of the page, on top of the repositories search box.

Follow the instructions and make your repository `public` so you want be able to use it to host your new content site

For the sake of this tutorial, let's say that your GitHub repository is called `repositoryname`

So, now you should have a repository URL like `https://github.com/username/repositoryname`.

## The scaffolding

Now, you will need some structure there.

Let's use a folder for your articles, and, once again, for the sake of this tutorial, let's say that the folder is called `content`. To do so using the web interface, you need to create your first article indeed. Let's call make it `home` and we'll make it your home page later.

Click the button `Add File` and select the option `Create new file`, or just browse to `https://github.com/username/repositoryname/new/main`.

In the `Name your file...` input , just type `content/home.md`. You can then add some text there

```markdown
# Welcome to repositoryname!

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
est laborum.

```

You can use the `Preview` button to check the results.

Ok, now you need some more files there.

### The navigation

You need to define the links that will appear in the top navigation bar. To do so, you need to create a markdown file in  `content` folder with any name, but let's call it `navigation.md`. Let's follow the same steps that you followed to create your homepage, but the contents will be something like

```markdown
[home](home.md)
[Cook Book](recipes.md)
[About](about.md)

```

All those lines are markdown links to files in `content` folder. You can use subfolders, but you can't point out of `content` folder. The only required line is the first one, because `home` is special.

Now, to follow this tutorial, you should create both `recipes.md` and `about.md` and fill them with the content you'd like.

### The "Not Found" page

Now, you need to create a page to redirect errors (when someone mistype a direction). Let's call it `notfound.md` (`404.md` would be the typical name for this kind of file, as 404 is the error code for `not found`). You should put some meaningful message there, like

```markdown

# Page not found

Not all who wander are lost.

But you're definitely lost.

```

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
          notFoundPage: 'notfound.md',
          navigationPage: 'navigation.md',,
          indexDepth: 3,
          style: 'light',
          bulma: 'materia',
          highlightTheme: 'monokai',
          useCdn: true
        });
  </script>
</body>

</html>

```

The code above renders a web with the same styling as this one. You can go to the [playground](playground.html) and play with the styling. Once you've got the styling combination you like, just go back to your HTML file and set the values of `bulma` (the overall theme), `style` and `higlightTheme` (the styling for blocks of code) to fit your selection.

You should change the title from `My Content Site` to the title of your choice.


## Enable GitHub Pages

Let's publish the web.

You need to enable `Pages` in your repository settings. To do so, click on :gear:`Settings` button and then `Pages` on the right menu, or just go to `https://github.com/username/repositoryname/settings/pages`

* **Build and deployment** : `Deploy from a branch`
* **Branch** : `main` and press `Save` button

That's it!


## Enjoy

Your new content site is now published at `https://username.github.io/repositoryname`

Now you can add fine-tune your web, there are lots of options. Just check the [readme](../README.md) for further info on customizing.
