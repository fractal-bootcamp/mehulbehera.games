export default function login() {
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
