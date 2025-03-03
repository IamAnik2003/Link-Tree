import React from 'react';
import styles from '../components/Header.module.css'; // Import the CSS module
import share from '../assets/share.png';
import toast from 'react-hot-toast';

export default function Header({ fullname, VITE_URL }) {
  const userID = localStorage.getItem('userID');

  // Function to handle share button click
  const handleShare = () => {
    const shareLink = `${VITE_URL}/profile/${userID}`;
    navigator.clipboard
      .writeText(shareLink)
      .then(() => toast.success('Profile copied to clipboard'))
      .catch((err) => console.error('Failed to copy link:', err));
  };

  return (
    <>
      <header>
        <div className={styles['head-container']}>
          <p style={{ fontWeight: 'bold', fontSize: '1.5em' }}>
            Hi, <span style={{ fontWeight: 'lighter' }}>{fullname}</span>!
          </p>
          <p>Congratulations. You got a great response today.</p>
          <div className={styles['share-container']} onClick={handleShare}>
            <img src={share} alt="Share icon" />
            <p>Share</p>
          </div>
        </div>
      </header>
    </>
  );
}