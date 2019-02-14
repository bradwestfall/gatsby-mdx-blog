import React from 'react'
import { Link } from 'gatsby'
import Layout from './layout'

const BrowseBlogPosts = ({ pageContext }) => {
  const { groupedPosts, group, page } = pageContext
  return (
    <Layout>
      {group.map(({ node }) => {
        const { title, author } = node.frontmatter
        return (
          <div key={node.id}>
            <header>
              <div>{title}</div>
              <div>Posting By {author}</div>
            </header>
            <p>{node.excerpt}</p>
            <Link to={node.fields.slug}>View Article</Link>
            <hr />
          </div>
        )
      })}
      <footer>
        Pages:{' '}
        {groupedPosts.map((x, index) => {
          const currentPage = index + 1
          return (
            <Link
              key={index}
              to={`/blog/${currentPage}`}
              className={currentPage === page ? 'active' : null}
            >
              {index + 1}
            </Link>
          )
        })}
      </footer>
    </Layout>
  )
}

export default BrowseBlogPosts
