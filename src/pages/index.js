import React from 'react'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'

import Bio from '../components/Bio'
import { rhythm } from '../utils/typography'

class BlogIndex extends React.Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.state = {
      searchText: ``,
      results: [],
      limit: 11
    };
  }

  componentDidMount() {
    const posts = get(this, 'props.data.allMarkdownRemark.edges')
    this.setState({results: posts});
  }

  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const posts = get(this, 'props.data.allMarkdownRemark.edges')

    var results = this.state.results;
    var count = 0;
    return (
      <div>
        <Helmet title={siteTitle} />
        <Bio />
        <label>Search: </label><input type="text" value={this.state.searchText} onChange={this.search}/>
        {results.map(({ node }) => {
          count++;
          if (count < this.state.limit) {
            const title = get(node, 'frontmatter.title') || node.fields.slug
            return (
              <div key={node.fields.slug}>
                <h3
                  style={{
                    marginBottom: rhythm(1 / 4),
                  }}
                >
                  <Link style={{boxShadow: 'none'}} to={node.fields.slug}>
                    {title}
                  </Link>
                </h3>
                <small>{node.frontmatter.date}</small>
                <p dangerouslySetInnerHTML={{__html: node.excerpt}}/>
              </div>
            )
          }
        })}
      </div>
    )
  }

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
}

export default BlogIndex

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
          }
        }
      }
    }
  }
`;
