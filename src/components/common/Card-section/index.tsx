type CardSectionType = {
  title: string;
  children: React.ReactNode;
  customStyle?: string;
};

const CardSection = ({ children }: CardSectionType) => {
  return (
    <div className="px-8 py-6 border bg-dark-card-background dark:border-dark-card-border box-shadow">
      {children}
    </div>
  );
};

export default CardSection;
