export const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col justify-center items-center p-3 text-sm bg-elevated">
      <span>
        Released under the{' '}
        <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noreferrer">
          MIT License
        </a>
        .
      </span>

      <span>
        Made with ❤️ by{' '}
        <a href="https://ugureren.net" target="_blank" rel="noreferrer">
          Uur Eren
        </a>
        .
      </span>
    </footer>
  );
};
