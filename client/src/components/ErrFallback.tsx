export default function ErrorFallback() {
	const notFoundImage = 'assets/mortys_pocket_pizza.png';
	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100vw', height: '100vh' }}>
			<img style={{ maxWidth: '25%', transform: 'translateX("-200px")' }} src={notFoundImage} />
			<h1>Oops..</h1>
			<h3>We made a mistake.</h3>
			<h5>Try refreshing or trying again later/</h5>
		</div>
	);
}
