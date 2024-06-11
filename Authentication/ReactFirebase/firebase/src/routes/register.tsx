export default function register() {
  return (
    <div className="flex flex-col">
      <label>
        Enter email: <input name="EmailInput" placeholder="" />
      </label>
      <label>
        Enter password: <input name="Password" placeholder="" />
      </label>
    </div>
  );
}
