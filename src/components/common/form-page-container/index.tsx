const FormPageContainer = ({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: () => void;
}) => {
  return (
    <div className="flex flex-col h-full">
      {' '}
      <form onSubmit={onSubmit} className="pb-4">
        {children}
      </form>
    </div>
  );
};

export default FormPageContainer;
