import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl }) => {
	return (
		<div className="center ma">
			<img src={imageUrl} alt="detect face"></img>
		</div>
	);
};

export default FaceRecognition;
