---
title: First blog using gatsby.js
date: "2018-02-22T22:12:03.284Z"
---

Ok, so I have been pondering making a blog for some time. I have long thought that I should be documenting
the issues I face daily and how I resolve them. Mostly because I will likely face the same issues again, and my
solutions may prove useful to other.

The reason I am _actually_ going through with this is because I
wanted to mess around with gatsby.js, which is a react based static site generator.

I will just give a short walk through as to what I did to get this site up and running.

1. Install the gatsby CLI `npm install --global gatsby-cli`
2. Use the CLI to generate a new site from existing repo
`gatsby new mirakolous-blog https://github.com/gatsbyjs/gatsby-starter-blog`
3. Replace the metadata, blog posts with actual data

BOOM!

Not hard, right? But I wanted to take it a step further

I wanted syntax highlighting for my code example:
```javascript
function myFunct(var) {
  console.log('Is this highlighted?')
}
```

Simple enough. Just install PrismJS `npm install --save gatsby-transformer-remark gatsby-remark-prismjs`

Add the plugin in your `gatsby-config.js` like so:
```javascript
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              // Class prefix for <pre> tags containing syntax highlighting;
              // defaults to 'language-' (eg <pre class="language-js">).
              // If your site loads Prism into the browser at runtime,
              // (eg for use with libraries like react-live),
              // you may use this to prevent Prism from re-processing syntax.
              // This is an uncommon use-case though;
              // If you're unsure, it's best to use the default value.
              classPrefix: "language-",
            },
          },
        ],
      },
    },
```

And require it in `src/layouts/index.js`
```javascript
require("prismjs/themes/prism-solarizedlight.css");
```
Also, I grabbed some _better_ CSS from a11y dark theme at https://github.com/PrismJS/prism/blob/gh-pages/themes/prism-okaidia.css

### GraphQL Search
So...I wanted to be able to search my blogs.

I checked out a gatsby search plugin https://github.com/andrew-codes/gatsby-plugin-elasticlunr-search,
but i was not able to get it to work quite right. I had actually built a search in a previous react application. I
decided it would be easiest to implement that. Plus, I would get to understand the GraphQL querying in gatsby.

First, I refactored my code from github into this search function.
```javascript
  search (e) {
    var searchText = e.target.value;
    this.setState({searchText: searchText});
    const posts = get(this, 'props.data.allMarkdownRemark.edges')
    if (searchText.length > 0) {
      // Create the regex search string if not empty
      var search = searchText.trim().toLowerCase();
      var searchArray = search.split(" ");
      var searchString = '';
      for (var i = 0; i < searchArray.length; i++) {
        searchString += '(?=.*' + searchArray[i] + ')';
      }
      var programSearch = posts.filter(function(p){
        var reSearch = new RegExp(searchString);
        return p.node.frontmatter.title.toLowerCase().match( reSearch ) || p.node.frontmatter.date.toLowerCase().match( reSearch );
      })
      this.setState({results: programSearch});
    } else {
      this.setState({results: posts});
    }
  }
```

We are just grabbing the search input value, updating the state, creating a regex, and matching that regex in
javascript's filter function. Then we set the results state. (programSearch is actually from the previous usecase, but
I am lazy).

The only other thing I did was add a blog limit. I will probably add a load more button eventually (bcuz it is
stupid easy)
