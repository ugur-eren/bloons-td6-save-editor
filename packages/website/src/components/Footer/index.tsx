export const Footer: React.FC = () => {
  return (
    <footer className="flex flex-row p-3 text-sm bg-elevated">
      <div className="flex-1" />

      <div className="flex flex-col justify-center items-center">
        <span>
          Made with ❤️ by{' '}
          <a href="https://ugureren.net" target="_blank" rel="noreferrer">
            Uur Eren
          </a>
          . Released under the{' '}
          <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noreferrer">
            MIT License
          </a>
          .
        </span>

        <span>
          View source at Github{' '}
          <a
            href="https://github.com/ugur-eren/bloons-td6-save-editor"
            target="_blank"
            rel="noreferrer"
          >
            ugur-eren/bloons-td6-save-editor
          </a>
        </span>
      </div>

      <div className="flex flex-1 items-center justify-end">
        <iframe
          src="https://ghbtns.com/github-btn.html?user=ugur-eren&repo=bloons-td6-save-editor&type=watch&count=false&size=large&v=2"
          width="170"
          height="30"
          title="GitHub"
          className="outline-0"
        />
      </div>
    </footer>
  );
};
