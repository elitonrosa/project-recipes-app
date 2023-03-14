import React, { useEffect, useState } from 'react';

import '../styles/components/ClipboardModal.sass';

const TIMEOUT = 1500;

function ClipboardModal() {
  const [fadeout, setFadeout] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setFadeout('fadeOut');
    }, TIMEOUT);
  }, []);

  return (
    <div className={ `clipboardModal ${fadeout}` }>
      <div className="messageContainer">
        <svg
          width="80px"
          height="80px"
          viewBox="0 0 133 133"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            id="check-group"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <circle
              id="filled-circle"
              fill="#FCC436"
              cx="66.5"
              cy="66.5"
              r="54.5"
            />
            <circle
              id="white-circle"
              fill="#FFFFFF"
              cx="66.5"
              cy="66.5"
              r="55.5"
            />
            <circle
              id="outline"
              stroke="#FCC436"
              strokeWidth="4"
              cx="66.5"
              cy="66.5"
              r="54.5"
            />
            <polyline
              id="check"
              stroke="#FFFFFF"
              strokeWidth="10"
              points="41 70 56 85 92 49"
            />
          </g>
        </svg>
        <p>Link Copied!</p>
      </div>
    </div>
  );
}

export default ClipboardModal;
