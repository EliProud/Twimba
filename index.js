import { tweetsData } from './data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

// Load saved tweets from localStorage
const savedTweetsData = JSON.parse(localStorage.getItem('tweetsData'));
if (savedTweetsData) {
  tweetsData.length = 0;
  savedTweetsData.forEach((tweet) => tweetsData.push(tweet));
}

document.addEventListener('click', function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === 'tweet-btn') {
    handleTweetBtnClick();
  } else if (e.target.dataset.delete) {
    handleDeleteClick(e.target.dataset.delete);
  }
});

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.find((tweet) => tweet.uuid === tweetId);

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  render();
  saveTweetsToLocalStorage();
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.find((tweet) => tweet.uuid === tweetId);

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
  saveTweetsToLocalStorage();
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle('hidden');
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById('tweet-input');

  if (tweetInput.value) {
    tweetsData.unshift({
      handle: '@Scrimba',
      profilePic: 'images/scrimbalogo.png',
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
    render();
    tweetInput.value = '';
    saveTweetsToLocalStorage();
  }
}

function handleDeleteClick(tweetId) {
  const tweetIndex = tweetsData.findIndex((tweet) => tweet.uuid === tweetId);
  if (tweetIndex > -1) {
    tweetsData.splice(tweetIndex, 1);
    render();
    saveTweetsToLocalStorage();
  }
}

function saveTweetsToLocalStorage() {
  localStorage.setItem('tweetsData', JSON.stringify(tweetsData));
}

function getFeedHtml() {
  let feedHtml = '';

  tweetsData.forEach(function (tweet) {
    let likeIconClass = '';

    if (tweet.isLiked) {
      likeIconClass = 'liked';
    }

    let retweetIconClass = '';

    if (tweet.isRetweeted) {
      retweetIconClass = 'retweeted';
    }

    let repliesHtml = '';

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${reply.handle}</p>
            <p class="tweet-text">${reply.tweetText}</p>
        </div>
    </div>
</div>
`;
      });
    }

    feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-trash" data-delete="${tweet.uuid}"></i>
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-reply" data-reply-input="${tweet.uuid}"></i>
                </span>
            </div>
        </div>
    </div>
    <div class="tweet-reply-input hidden" id="reply-input-${tweet.uuid}">
        <input type="text" placeholder="Reply..." class="reply-input" id="input-${tweet.uuid}">
        <button data-tweet="${tweet.uuid}" class="reply-btn">Reply</button>
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>
</div>
`;
  });
  return feedHtml;
}

function render() {
  document.getElementById('feed').innerHTML = getFeedHtml();
}

render();

// Add event listener for reply button clicks
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('reply-btn')) {
    const tweetId = e.target.dataset.tweet;
    const inputElement = document.getElementById(`input-${tweetId}`);
    const replyText = inputElement.value;

    if (replyText) {
      const targetTweetObj = tweetsData.find((tweet) => tweet.uuid === tweetId);

      targetTweetObj.replies.push({
        handle: '@Scrimba',
        profilePic: 'images/scrimbalogo.png',
        tweetText: replyText,
      });

      inputElement.value = '';
      render();
      saveTweetsToLocalStorage();
    }
  }
});

// Add event listener for reply input toggle
document.addEventListener('click', function (e) {
  if (e.target.dataset.replyInput) {
    const replyInputId = `reply-input-${e.target.dataset.replyInput}`;
    document.getElementById(replyInputId).classList.toggle('hidden');
  }
});


