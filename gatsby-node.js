const { createFilePath } = require('gatsby-source-filesystem')
const path = require('path')

// Here we're adding extra stuff to the "node" (like the slug)
// so we can query later for all blogs and get their slug
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  if (node.internal.type === 'Mdx') {
    const value = createFilePath({ node, getNode })
    createNodeField({
      // Name of the field you are adding
      name: 'slug',
      // Individual MDX node
      node,
      // Generated value based on filepath with "blog" prefix
      value: `/blog${value}`
    })
  }
}

// Programmatically create the pages for browsing blog posts
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return graphql(`
    query {
      allMdx(sort: { order: DESC, fields: [frontmatter___date] }) {
        edges {
          node {
            id
            excerpt(pruneLength: 250)
            fields {
              slug
            }
            frontmatter {
              author
              title
            }
          }
        }
      }
    }
  `).then((results, errors) => {
    if (errors) return Promise.reject(errors)
    const posts = results.data.allMdx.edges

    // This little algo takes the array of posts and groups
    // them based on this `size`. I used a small number just
    // for testing since there are only three posts
    let size = 2
    let start = 0
    let groupedPosts = Array.from(Array(Math.ceil(posts.length / size)))
    groupedPosts = groupedPosts.map(() => {
      const group = posts.slice(start, start + size)
      start += size
      return group
    })

    groupedPosts.forEach((group, index) => {
      const page = index + 1
      createPage({
        path: `/blog/${page}`,
        component: path.resolve('./src/components/browse-blog-posts.js'),
        context: { groupedPosts, group, page }
      })
    })
  })
}
