const ProcessCategories = ({categories}) => {
  return Object.keys(categories).map((category_slug,i) => {
    let category_obj = categories[category_slug];
    return <a key={i} href={"/blog/category/" + category_slug + "/" + category_obj.id}>{category_obj.name}</a>;  
  });
}

export default ProcessCategories;