import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Home = ({ userObj }) => {
  const [cnt, setCnt] = useState(0); //Re rendering cnt
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  const history = useHistory();

  const getTweets = async () => {
    let dbTweets = await dbService.collection("tweet").get();
    setCnt(cnt + 1);
    setTweets([]);
    dbTweets.forEach((document) => {
      const tweetObject = {
        ...document.data(),
        id: document.id,
      };
      setTweets((prev) => [tweetObject, ...prev]);
    });
  };
  useEffect(() => {
    getTweets();
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    const data = await dbService.collection("tweet").add({
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setTweet("");
    getTweets();
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };
  console.log(tweets);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          value={tweet}
          type="text"
          placeholder="what's on your mind"
          maxLength={120}
        />
        <input type="submit" value="Tweet" />
      </form>
      <div>
        {tweets.map((tweet) => (
          <div>
            <h4>{tweet.text} </h4>
          </div>
        ))}
      </div>
      <span>rendering : {cnt} times..</span>
    </div>
  );
};

export default Home;
