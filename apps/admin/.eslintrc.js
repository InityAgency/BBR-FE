module.exports = {
    extends: [
      'next/core-web-vitals'
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn', // or 'off' if you want to completely disable
      '@next/next/no-html-link-for-pages': 'warn', // or 'off'
      '@next/next/no-img-element': 'warn' // or 'off'
    }
  }