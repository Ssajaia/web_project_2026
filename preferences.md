# Coding Preferences – HTML, CSS, JavaScript, PHP

This document defines coding standards, naming conventions, structure, and best practices for projects using **HTML, CSS, JavaScript, and PHP**.

The goal is **clarity, maintainability, and predictable structure**.

---

# 1. Core Principles

## 1.1 Readability

Code must be understandable without additional explanation.

Rules:

* Use **descriptive names**
* Avoid unnecessary abbreviations
* Prefer clarity over cleverness

Bad

```js
let x = a + b;
```

Good

```js
const totalPrice = basePrice + taxAmount;
```

---

## 1.2 Separation of Responsibilities

Each technology has a specific role.

| Technology | Responsibility    |
| ---------- | ----------------- |
| HTML       | Structure         |
| CSS        | Visual styling    |
| JavaScript | Client-side logic |
| PHP        | Server-side logic |

Never mix responsibilities unnecessarily.

Bad:

```php
echo "<div style='color:red'>Error</div>";
```

Good:

```php
echo "<div class='error-message'>Error</div>";
```

---

## 1.3 Consistency

The same rules must be followed across the entire codebase:

* Same indentation
* Same naming patterns
* Same file structure

Inconsistent code significantly reduces maintainability.

---

# 2. Project Folder Structure

Recommended structure:

```
project-root
│
├── public
│   ├── index.php
│   │
│   ├── css
│   │   └── stylesheet.css
│   │
│   ├── js
│   │   ├── main.js
│   │   └── modules
│   │       ├── modal.js
│   │       ├── form-validator.js
│   │       └── api-client.js
│   │
│   └── images
│
├── app
│   ├── controllers
│   │   └── UserController.php
│   │
│   ├── models
│   │   └── User.php
│   │
│   ├── services
│   │   └── AuthService.php
│   │
│   └── views
│       ├── layouts
│       │   └── main-layout.php
│       │
│       └── pages
│           ├── home.php
│           ├── login.php
│           └── dashboard.php
│
├── config
│   └── database.php
│
└── preferences.md
```

Rules:

* **public/** contains files accessible by the browser.
* **index.php** is the application entry point.
* **CSS must exist as a single global file: `stylesheet.css`.**
* JavaScript logic may be separated into modules.

---

# 3. File Naming Conventions

## 3.1 HTML / PHP Views

Use **kebab-case**.

Correct:

```
user-profile.php
login-page.php
admin-dashboard.php
```

Incorrect:

```
UserProfile.php
userProfile.php
profilePage.php
```

---

## 3.2 JavaScript Files

Use **kebab-case**.

Examples:

```
main.js
modal-controller.js
form-validator.js
api-client.js
```

---

## 3.3 PHP Classes

Use **PascalCase**.

Examples:

```
User.php
UserController.php
AuthService.php
DatabaseConnection.php
```

---

# 4. Variable Naming

## 4.1 JavaScript Variables

Use **camelCase**.

Correct:

```js
let userName
let totalPrice
let isAuthenticated
```

Incorrect:

```js
let user_name
let username
let TotalPrice
```

Boolean variables should start with:

```
is
has
should
can
```

Examples:

```
isLoggedIn
hasPermission
shouldReload
canSubmit
```

---

## 4.2 PHP Variables

Use **camelCase**.

Correct:

```php
$userName
$totalPrice
$isAdmin
```

Incorrect:

```php
$user_name
$TotalPrice
```

---

# 5. Function Naming

Functions must describe **actions**.

Use **verb-based naming**.

Examples:

Good:

```
getUserById()
createUser()
validateForm()
sendEmail()
calculateTotalPrice()
```

Bad:

```
user()
data()
doThing()
process()
```

---

# 6. HTML Structure

HTML must be structured clearly.

Example:

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Dashboard</title>
    <link rel="stylesheet" href="/css/stylesheet.css">
</head>

<body>

<header>
    <nav>
        <!-- navigation -->
    </nav>
</header>

<main>
    <!-- page content -->
</main>

<footer>
    <!-- footer -->
</footer>

<script src="/js/main.js"></script>
</body>

</html>
```

Rules:

* Only **one stylesheet file**: `stylesheet.css`
* Scripts should be loaded **at the end of the body**
* Avoid inline styles and inline scripts

---

# 7. CSS Conventions

All styling must be written inside:

```
stylesheet.css
```

Use **class-based styling**.

Correct:

```css
.user-card {
    padding: 16px;
    border-radius: 6px;
}
```

Incorrect:

```css
div {
    padding: 16px;
}
```

Avoid excessive selector nesting.

Bad:

```css
body div main section article h2 {
    color: red;
}
```

Good:

```css
.article-title {
    color: red;
}
```

---

# 8. JavaScript Structure

JavaScript should follow modular logic.

`main.js` acts as the entry point.

Example:

```
main.js
modules/modal.js
modules/form-validator.js
modules/api-client.js
```

Example structure:

```js
document.addEventListener("DOMContentLoaded", () => {
    initializeApp()
})

function initializeApp() {
    initializeModal()
    initializeForms()
}
```

---

# 9. PHP Architecture

Backend should follow simple layered architecture.

Layers:

```
Controller
Service
Model
```

Example flow:

```
HTTP Request
   ↓
Controller
   ↓
Service
   ↓
Model
   ↓
Database
```

---

## Example Controller

```php
class UserController
{
    public function getProfile($userId)
    {
        $userService = new UserService();
        $user = $userService->getUserById($userId);

        require "../views/pages/profile.php";
    }
}
```

---

# 10. Security Practices

Mandatory practices:

### Escape Output

```php
htmlspecialchars($userName, ENT_QUOTES, 'UTF-8');
```

### Validate Inputs

Never trust user input.

```php
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
```

### Prevent SQL Injection

Use prepared statements.

---

# 11. Indentation and Formatting

Use:

```
4 spaces indentation
```

Never mix tabs and spaces.

Example:

```php
if ($user !== null) {
    $userService->updateLastLogin($user->id);
}
```

---

# 12. Comments

Comments should explain **why**, not **what**.

Bad:

```js
// increment i
i++;
```

Good:

```js
// retry counter for failed API requests
retryCount++;
```

---

# 13. Avoid These Practices

Do not use:

* Inline CSS
* Inline JavaScript
* Global variables when avoidable
* Large files with unrelated logic
* Magic numbers

Bad:

```js
if (user.role === 3)
```

Good:

```js
const ROLE_ADMIN = 3;

if (user.role === ROLE_ADMIN)
```

---

# 14. Final Rules

Always ensure:

* Descriptive naming
* Predictable structure
* One global stylesheet (`stylesheet.css`)
* Clean separation of frontend and backend
* Modular JavaScript
* Secure PHP practices

Code should be **predictable, readable, and maintainable**.
