import 'dotenv/config'

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('src/assets')
  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      layouts: '_layouts',
    },

    passthroughFileCopy: true,
  }
}
