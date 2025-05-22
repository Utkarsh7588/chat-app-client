<template>
  <router-view/>
</template>
<style >
:root {
  --primary-color: #4361ee;
  --primary-light: #e0e7ff;
  --secondary-color: #3f37c9;
  --text-color: #2b2d42;
  --text-light: #8d99ae;
  --bg-color: #f8f9fa;
  --white: #ffffff;
  --gray-light: #e9ecef;
  --gray-medium: #ced4da;
  --success-color: #4caf50;
  --error-color: #f44336;
  --warning-color: #ff9800;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --transition: all 0.2s ease;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#app {
  font-family: "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
    "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
  background-color: var(--bg-color);
  /* height: 100vh; */
  display: flex;
  flex-direction: column;
  max-width: 100%;
  overflow: hidden;
}
</style>
