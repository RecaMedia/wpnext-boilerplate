![alt text](https://github.com/RecaMedia/wpnext-boilerplate/blob/master/banner.jpg "WPNext")

# About WPNext

WPNext was created with the goal of combining the development style of [ReactJS](https://reactjs.org/)/[NextJS](https://nextjs.org/) with the community support of WordPress, to rapidly create [WordPress](https://wordpress.org/) themes completely built with React. Along with this, the admin UI/UX concept was pulled from [JayDMS](https://github.com/RecaMedia/JayDMS-Dev) that allows the user to easily construct pages with React components. This boilerplate includes a hero and blog component as a start.

# Getting Started

This boilerplate uses [Gulp JS](https://gulpjs.com/) to build and run development. Run all commands within the theme folder.

**Install**
```sh
$ npm install
```

To build and make modifications to WPNext builder within the WordPress admin UI, use the commands below. All related files will be under `/admin/development`.

**Build CSS & JS for WPNext Builder**
```sh
$ gulp --type builder
```

**Build CSS & JS for WPNext Builder while in development**
```sh
$ gulp dev --type builder
```

**Build CSS & JS for WPNext Builder for production**
```sh
$ gulp --type builder --prod
```

To build and make modifications to the Front-End CSS & images, use the commands below. All related files will be under  `/assets/img` or `/assets/scss`.

**Build CSS & Images for Front-End**
```sh
$ gulp --type next
```

**Build CSS & Images for Front-End while in development**
```sh
$ gulp dev --type next
```

**Build CSS & Images for Front-End for production**
```sh
$ gulp --type next --prod
```

All components that will appear within the WPNext Builder live under `/components` directory. However, the files need to follow a certain structure and need to be linked to be included into the build. Use the command below which will create and link files as necessary.

**Create new component**
```sh
$ gulp new-component --name [componentName]
```

**Use NextJS commands as needed.**

```sh
$ npm run dev
$ npm run build
$ npm start
```

You will need two URLs to make this theme work. The first URL would be for accessing the WordPress admin and it's contents. The second URL for the Front-End which is run by NextJS. Use the `vhost-example.txt` example below for the second URL. Also, you'll need to change the home URL within the WordPress admin settings. Ex: `wp.yourdomain.local & yourdomain.local`.

```sh
<VirtualHost *:80>
	ServerName yourdomain.local
	DocumentRoot "c:/path/to/themes/wp-next"

  <Location />
    ProxyPass http://localhost:3000/
  </Location>

	<Directory "c:/path/to/wp-content/themes/wp-next">
		...
	</Directory>
</VirtualHost>
```

## Like WPNext?

If you would like to support WPNext and it's development, please star this project to bring awareness. Also, please support RM Digital Services with your [donations](https://github.com/sponsors/RecaMedia) for engineering and development services.
