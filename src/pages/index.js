import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'
import styled from 'styled-components'

import { Layout, Article, Wrapper, Button, SectionTitle } from '../components'
import config from '../../config'

const Content = styled.div`
  grid-column: 2;
  box-shadow: 0 4px 120px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  padding: 3rem 6rem;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 3rem 2rem;
  }
  @media (max-width: ${props => props.theme.breakpoints.phone}) {
    padding: 2rem 1.5rem;
  }
  overflow: hidden;
`

const Hero = styled.div`
  grid-column: 2;
  padding: 3rem 2rem 6rem 2rem;
  text-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  color: ${props => props.theme.colors.grey.dark};

  @media (max-width: ${props => props.theme.breakpoints.phone}) {
    padding: 2rem 1rem 4rem 1rem;
  }

  p {
    font-size: 1.68rem;
    margin-top: -1rem;
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      font-size: 1.45rem;
    }
    @media (max-width: ${props => props.theme.breakpoints.phone}) {
      font-size: 1.25rem;
    }
  }
`

const IndexPage = ({
  data: {
    allMdx: { nodes: posts },
    allMediumPost: { nodes: mediumPosts },
  },
}) => (
    <Layout>
      <Wrapper>
        <Hero>{/* <h1>Hi.</h1> */}</Hero>
        <Content>
          <SectionTitle>Latest</SectionTitle>
          {mediumPosts.map(post => (
            <Article
              title={post.title}
              date={post.createdAt}
              excerpt={post.virtuals.subtitle}
              url={`https://medium.com/p/${post.uniqueSlug}`}
              timeToRead={Math.round(post.virtuals.readingTime, 0)}
              slug={post.slug}
              categories={[] || post.virtuals.tags.map(x => x.name)} // TODO: Impl. categories for all
              key={post.id}
            />
          ))}
          {posts.map(post => (
            <Article
              title={post.frontmatter.title}
              date={post.frontmatter.date}
              excerpt={post.excerpt}
              url={post.frontmatter.url}
              timeToRead={post.timeToRead}
              slug={post.fields.slug}
              categories={post.frontmatter.categories}
              key={post.fields.slug}
            />
          ))}
        </Content>
      </Wrapper>
    </Layout>
  )

export default IndexPage

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMdx: PropTypes.shape({
      nodes: PropTypes.array.isRequired,
    }),
    allMediumPost: PropTypes.shape({
      nodes: PropTypes.array.isRequired,
    }),
  }).isRequired,
}

export const IndexQuery = graphql`
  query IndexQuery {
    allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          date(formatString: "MM/DD/YYYY")
          categories
          url
        }
        excerpt(pruneLength: 200)
        timeToRead
      }
    }
    allMediumPost(sort: { fields: [createdAt], order: DESC }) {
      nodes {
        id
        slug
        uniqueSlug
        title
        virtuals {
          subtitle
          tags {
            name
          }
          readingTime
        }
        createdAt(formatString: "MM/DD/YYYY")
      }
    }
  }
`
