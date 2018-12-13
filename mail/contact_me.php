<?php
	// Check for empty fields
	if(empty($_POST['name'])  		||
	   empty($_POST['email']) 		||
	   empty($_POST['message'])	||
	   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
	   {
		echo "No se cargaron datos en formulario";
		return false;
	   }
		
	$name = $_POST['name'];
	$email_address = $_POST['email'];
	$phone = $_POST['phone'];
	$message = $_POST['message'];
		
	// Create the email and send the message
	$to = 'TO@ADDRESS.COM'; // Add your email address inbetween the '' replacing yourname@yourdomain.com - This is where the form will send a message to.
	$email_subject = "Formulario de Contacto de Sitio:  $name";
	$email_body = "Has recibido un nuevo mensaje de tu formulario de contacto en el sitio web..\n\n"."Estos son los detalles:\n\Nombre: $name\n\nEmail: $email_address\n\nMensaje:\n$message";
	$headers = "Desde: FROM@ADDRESS.COM\n"; // This is the email address the generated message will be from. We recommend using something like noreply@yourdomain.com.
	$headers .= "Reply-To: $email_address";	
	mail($to,$email_subject,$email_body,$headers);
	return true;			
?>