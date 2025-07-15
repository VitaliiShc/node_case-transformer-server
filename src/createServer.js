const http = require('node:http');
const { convertToCase } = require('./convertToCase');
const { badRequestHandler } = require('./helpers/badRequestHandler.js');

const SUPPORTED_CASES = ['SNAKE', 'KEBAB', 'CAMEL', 'PASCAL', 'UPPER'];

function createServer() {
  const server = http.createServer((req, res) => {
    if (req.method !== 'GET') {
      res.statusCode = 404;
      res.statusMessage = 'Not Found';
      res.end(badRequestHandler('notFound'));

      return badRequestHandler('notFound');
    }

    res.setHeader('Content-Type', 'application/json');

    if (req.url === '/') {
      res.statusCode = 400;
      res.statusMessage = 'Bad request';
      res.end(badRequestHandler('emptyTextToConvert', 'emptyQueryParam'));

      return badRequestHandler('emptyTextToConvert', 'emptyQueryParam');
    }

    const [text, searchParams] = req.url.slice(1).split('?');

    const toCase = new URLSearchParams(searchParams).get('toCase');

    if (toCase === null || toCase === undefined || !toCase) {
      res.statusCode = 400;
      res.statusMessage = 'Bad request';
      res.end(badRequestHandler('emptyQueryParam'));

      return badRequestHandler('emptyQueryParam');
    }

    const isValidText = text.length > 0;

    const isCaseSupported = SUPPORTED_CASES.includes(toCase);

    if (!isValidText && !isCaseSupported) {
      res.statusCode = 400;
      res.statusMessage = 'Bad request';
      res.end(badRequestHandler('emptyTextToConvert', 'unsupportedCase'));

      return badRequestHandler('emptyTextToConvert', 'unsupportedCase');
    }

    if (!isValidText) {
      res.statusCode = 400;
      res.statusMessage = 'Bad request';
      res.end(badRequestHandler('emptyTextToConvert'));

      return badRequestHandler('emptyTextToConvert');
    }

    const originalText = text;

    if (!isCaseSupported) {
      res.statusCode = 400;
      res.statusMessage = 'Bad request';
      res.end(badRequestHandler('unsupportedCase'));

      return badRequestHandler('unsupportedCase');
    }

    const targetCase = toCase;

    const { originalCase, convertedText } = convertToCase(
      originalText,
      targetCase,
    );

    res.end(
      JSON.stringify({
        originalCase,
        targetCase,
        originalText,
        convertedText,
      }),
    );

    return JSON.stringify({
      originalCase,
      targetCase,
      originalText,
      convertedText,
    });
  });

  return server;
}

module.exports = {
  createServer,
};
