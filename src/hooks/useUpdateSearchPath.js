sessionStorage.setItem("search_path", "");
function updateSearchPath(newValue, reset) {
  let currentPath = sessionStorage.getItem("search_path");
  let value = "";
  if (reset) {
    sessionStorage.setItem("search_path", "");
  } else {
    // if (currentPath.split("/").some(item => item.trim == newValue)) {
    // }
    let arr = currentPath.split("/");
    console.log(newValue);

    let index = arr.findIndex((item) => item == newValue);
    if (index == -1) {
      arr.push(newValue);
      console.log(arr);
    } else {
      arr = arr.slice(0, index + 1);
    }

    //     .map((item) => {
    //       if (item.trim == newValue) {
    //         let index = currentPath.indexOf(item.trim);
    //         value = currentPath.slice(index, currentPath.length);
    //       } else {
    //         value = currentPath + " / " + newValue;
    //       }
    //     });
    sessionStorage.setItem("search_path", arr.join("/"));
  }
}

export { updateSearchPath };
