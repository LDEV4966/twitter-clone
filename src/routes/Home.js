import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import Tweet from "components/Tweet";
const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  const [attachment, setAttachment] = useState(null);
  /* setTweets을 할 때마다 re-rendering 을 해주는 옛날 방식이다. 
  const getTweets = async () => {
    let dbTweets = await dbService.collection("tweet").get();
    setTweets([]);
    dbTweets.forEach((document) => {
      const tweetObject = {
        ...document.data(),
        id: document.id,
      };
      setTweets((prev) => [tweetObject, ...prev]);
    });
  };
  */
  useEffect(() => {
    // getTweets(); for each를 써서 firestore에 있는 정보를 끌어오는 방식이다. 이를 onSnapshot으로 대체 해 보겠음.
    // onSnapshot : read,delete,update등 다양한 db의 변화를 감지함
    dbService.collection("tweet").onSnapshot((snapShot) => {
      //() => () 이렇게 된다면 ()안의 값이 return값입니다.
      const tweetArray = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArray);
    });
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection("tweet").add({
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setTweet("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment(null);
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
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Tweet" />
        {attachment && (
          <div>
            <img src={attachment} alt="attachment" width="50px" height="50px" />
            <button onClick={onClearAttachment}>Cancle upload</button>
          </div>
        )}
      </form>
      <div>
        {tweets.map((tweet) => (
          <Tweet
            tweetObj={tweet}
            key={tweet.id}
            isOwner={tweet.creatorId === userObj.uid ? true : false}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
