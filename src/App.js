import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';

const particlesOptions = {
	particles: {
		number: {
			value: 50,
			density: {
				enable: true,
				value_area: 400,
			},
		},
	},
};

const initialState = {
	input: '',
	imageUrl: '',
	box: {},
	route: 'signin',
	isSignedIn: false,
	user: {
		id: '',
		name: '',
		email: '',
		entries: 0,
		joined: '',
	},
};

class App extends React.Component {
	constructor() {
		super();
		this.state = initialState;
	}

	loadUser = data => {
		this.setState({
			user: {
				id: data.id,
				name: data.name,
				email: data.email,
				entries: data.entries,
				joined: data.joined,
			},
		});
	};

	calculateFaceLocation = data => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;

		const image = document.getElementById('inputimage');

		const width = Number(image.width);
		const height = Number(image.height);
		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - clarifaiFace.right_col * width,
			bottomRow: height - clarifaiFace.bottom_row * height,
		};
	};

	displayFaceBox = box => {
		this.setState({ box: box });
	};

	onInputChange = event => {
		this.setState({ input: event.target.value });
	};

	onButtonSubmit = event => {
		this.setState({ imageUrl: this.state.input });

		fetch('https://obscure-bastion-88248.herokuapp.com//facedetect', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ input: this.state.input }),
			mode: 'cors',
		})
			.then(response => response.json())
			.then(response => {
				if (response) {
					fetch('https://obscure-bastion-88248.herokuapp.com//image', {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ id: this.state.user.id }),
						mode: 'cors',
					})
						.then(response => response.json())
						.then(count => {
							this.setState(Object.assign(this.state.user, { entries: count }));
						})
						.catch(err => {
							console.log(err);
						});
				}
				this.displayFaceBox(this.calculateFaceLocation(response));
			})
			.catch(err => console.log(err));
	};

	onRouteChange = route => {
		if (route === 'signout') {
			this.setState(initialState);
		} else if (route === 'home') {
			this.setState({ isSignedIn: true });
		} else if (route === 'signin') {
			this.setState({ isSignedIn: true });
		}
		this.setState({ route: route });
	};

	render() {
		const { isSignedIn, imageUrl, route, box } = this.state;
		return (
			<div className='App'>
				<Particles className='particles' params={particlesOptions} />
				<Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
				<Logo />
				{route === 'home' ? (
					<div>
						<Rank name={this.state.user.name} entries={this.state.user.entries} />
						<ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
						<FaceRecognition imageUrl={imageUrl} box={box} />
					</div>
				) : route === 'signin' ? (
					<Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
				) : (
					<Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
				)}
			</div>
		);
	}
}

export default App;
