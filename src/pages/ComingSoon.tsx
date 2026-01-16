export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-gray-500">This page is not part of the demo.</p>
      <p className="text-gray-500 mt-2">Navigate to <strong>S City</strong> or <strong>Collaborators</strong></p>
    </div>
  );
}
