// Picks the reviewer whose expertise overlaps most with the paper keywords.
function findBestMatch(paperKeywords, reviewers) {
  let bestMatch = null;
  let highestScore = 0;
  let bestMatchedKeywords = [];

  reviewers.forEach((reviewer) => {
    const matchedKeywords = [];

    paperKeywords.forEach((keyword) => {
      const found = reviewer.expertise.some(
        (exp) => exp.toLowerCase() === keyword.toLowerCase()
      );
      if (found) matchedKeywords.push(keyword);
    });

    const score = matchedKeywords.length;

    if (score > highestScore) {
      highestScore = score;
      bestMatch = reviewer;
      bestMatchedKeywords = matchedKeywords;
    }
  });

  return { bestMatch, highestScore, bestMatchedKeywords };
}

module.exports = { findBestMatch };
