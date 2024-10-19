import BlogShow from './blogs/BlogShow';
import Dashboard from './Dashboard';

export default function New(props) {
    console.log("Blogs>New", props)
    return <BlogShow props={props} />
}