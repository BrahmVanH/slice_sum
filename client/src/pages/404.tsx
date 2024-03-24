// Default 404 not found component
export default function NotFound() {
	const notFoundImage = 'assets/mortys_pocket_pizza.png';
	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100vw', height: '100vh' }}>
			<img style={{ maxWidth: '25%', transform: 'translateX("-200px")' }} alt='brand' src={notFoundImage} />
			<h1>404</h1>
			<h3>You look lost,</h3>
			<h5>better head back...</h5>
		</div>
	);
}
