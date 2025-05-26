export default function GenrePage({
  params,
}: {
  params: { genre_name: string };
}) {
  const genre = params.genre_name.replace("%20", " ");

  return <div>{genre}</div>;
}
