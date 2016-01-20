# CourseWare exercise materials processor

CourseWare is a tool for generating interactive materials for your lectures.

You can see DEMO materials here: https://angular-cz-courseware-examples.herokuapp.com

## Motivation
When you start creating materials you ussualy starts with nothing, then you go through the text files and html pages and there 
you come to the documentation generators. There you strugle with just text descriptions or invest your time and try to enhance the generator. 

There comes the CourseWare, its documentation specialized generator for programming courses and lectures.

CourseWare is product of materials evolution end we use it regularly in our Javascript and AngularJS lectures - http://www.angular.cz. 

### Features
 - single file documentation
 - generator from jade markup
 - responsive layout
 - components for hints and solutions
 - source highlighter
 - interactive integration of test results

### Will CourseWare be useful for me ?
You will get most benefits from CourseWare when you use it on some kind of javascript lectures. But it can serve also as platform independent documentation tool, because it produces single #[strong index.html] file.

## Brief info about usage

There we will describe typical use-case when you have already your exercises in separate folders, where students are supposed 
to edit source code and check the results in their browser.

First install the npm package: 

```
npm install angular-cz-courseware
```

Then create courseware configuration file **courseware.json** in the root of your package. 
You can create default configuration file with command

```
courseware init
```

Then add your exercise names to the **todos** array in the configuration file

```
{
  "introFile": "courseware-intro.jade",
  "header": "CourseWare usage DEMO",
  "todoFilePath": "complete/todo.jade",
  "todos": [
    "01-simple-generator",
    "02-generator-with-tests",
    "03-sandbox"
  ]
}
```

This tell CourseWare to use **courseware-intro.jade** as homepage and finds exercise instructions file **todo.jade** in folder 
**complete** of each item in exercises list.

It exactly reffers to our case, when each exercise folder lookd like the above. 
Source files to edit are in its root and materials are in folder with finished exercise

```
  |- 01-generator-with-tests
     |- complete
     |  |- app.js
     |  |- index.html
     |  |- todo.jade   <--- instructions for jade
     |
     |- app.js
     |- index.html
```

Then you can use CourseWare to build your materials into single index.html file using command

```
courseware build
```

You can use it both as package which compiles your documentation when the host package is being installed. 
Or globally just to generate single file documentation which is then included in repository.

### Develop mode
When you develop your materials, livereload can help you a lot. You can run this mode with command

```
courseware devel
```

Development server will run on http://localhost:8080, adds livereload server to the index.html,
and reload browser when some of todo.jade or courseware-intro.jade is changed.

### Examples repository as a full documentation

Definitely check the example repository where you can see typical javascript course structure. 
It will help you to understand how to use CouseWare in your course.
It contains not only DEMO course but also style galery and documentation. https://github.com/Angular-cz/courseware-examples

CourseWare is there integrated as package dependency and index.html is build when host package installed.

You can see examples and read documentation here: https://angular-cz-courseware-examples.herokuapp.com

## Contribution
We would be glad if you like this tool so much that you will help us to test this it, fix issues or create new features. 
Also if you write some article or use it in public course, let us know we will list it here.

### Technologies
Courseware is based on well known and documented technologies: Npm, Gulp, Jade, Bootstrap, Socket.io, Highlight.js, AngularJS, Karma, Jasmine 

... so you can also learn a lot about wide range of nice tools.

### How to develop CourseWare

Clone this package and link the cloned copy to the npm via

```
npm link
```

Then use examples as host package and run development server inside the examples package with command

```
courseware courseware-devel
```

Then checks and livereload are also provided for CourseWare internals.

## Licence
CourseWare is free for non-commercial and internal courses, and we would like to hear about your progress.

If you want to use CourseWare on commercial course, or get comercial support do not hasitate to contact us.

## Contact information

| Web: http://www.angular.cz | Twitter: @angular_cz |
