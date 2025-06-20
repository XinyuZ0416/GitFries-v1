import React from 'react'
import axios from 'axios'

export default function TestAssist() {
  const deleteAllComments = async () => {
    try {
      const response = await axios.delete('/api/deleteAllComments');
      console.log(response.data.message);
    } catch (error) {
      console.error('Error deleting all comments:', error);
      alert('Failed to delete all comments.');
    }
  };

  const deleteAllcommentsInIssueDB = async () => {
    try {
      const response = await axios.delete('/api/deleteAllCommentsInIssueDB');
      console.log(response.data.message);
    } catch (error) {
      console.error('Error deleting commentIDs in Issue schema:', error);
      alert('Failed to delete commentIDs in Issue schema.');
    }
  };

  const deleteAllcommentsInUserDB = async () => {
    try {
      const response = await axios.delete('/api/deleteAllCommentsInUserDB');
      console.log(response.data.message);
    } catch (error) {
      console.error('Error deleting commentIDs in User schema:', error);
      alert('Failed to delete commentIDs in User schema.');
    }
  }

  const deleteAllNotifications = async () => {
    try {
      const response = await axios.delete('/api/deleteAllNotifications');
      console.log(response.data.message);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      alert('Failed to delete all notifications.');
    }
  };
  

  return (
    <>
      <input type='button' value='[delete all comments]' onClick={deleteAllComments}/>
      <input type='button' value='[delete all commentsInIssueDB]' onClick={deleteAllcommentsInIssueDB}/>
      <input type='button' value='[delete all commentsInUserDB]' onClick={deleteAllcommentsInUserDB}/>
      <input type='button' value='[delete all notifications]' onClick={deleteAllNotifications}/>
    </>
  )
}
