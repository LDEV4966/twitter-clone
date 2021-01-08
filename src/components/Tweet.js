import { dbService } from "fbase";
import React, { useState } from "react";

const Tweet = ({ tweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const isDelete = async () => {
    const ok = window.confirm("Are you sure, you want to delete the tweet ?");
    if (ok) {
      await dbService.doc(`tweet/${tweetObj.id}`).delete(); //해당 doc의 id를 path 값으로 가지기에 이를 이용하여 삭제.
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewTweet(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (newTweet !== tweetObj.text) {
      await dbService.doc(`tweet/${tweetObj.id}`).update({ text: newTweet });
      toggleEditing();
    } else {
      alert("it's same tweet before you edit");
    }
  };
  return editing ? (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          value={newTweet}
          type="text"
          placeholder="Edit your tweet"
          required
        />
        <input type="submit" value="Update tweet" />
      </form>
      <button onClick={toggleEditing}>Cancle</button>
    </>
  ) : (
    <div>
      <h4>{tweetObj.text} </h4>
      {isOwner && (
        <>
          <div>
            <button onClick={isDelete}> Delete</button>
            <button onClick={toggleEditing}> Edit Tweet</button>
          </div>
        </>
      )}
    </div>
  );
};
export default Tweet;
