import BlogShow from '@/app/components/blogs/BlogShow';

export default function Show(props) {
    return <BlogShow id={props.params.id} />
}