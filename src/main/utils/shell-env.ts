import execa from "execa";
import stripAnsi from "strip-ansi";

interface ShellEnvVars {
    readonly [key: string]: string;
}

interface ShellEnvVarsInternal {
    [key: string]: string;
}

const defaultShell = (() => {
	const env = process.env;

	if (process.platform === 'darwin') {
		return env.SHELL || '/bin/bash';
	}

	if (process.platform === 'win32') {
		return env.COMSPEC || 'cmd.exe';
	}

	return env.SHELL || '/bin/sh';
})();

const args = [
	'-ilc',
	'echo -n "_SHELL_ENV_DELIMITER_"; env; echo -n "_SHELL_ENV_DELIMITER_"; exit'
];

const env = {
	// Disables Oh My Zsh auto-update thing that can block the process.
	DISABLE_AUTO_UPDATE: 'true'
};

const parseEnv = (env: string) => {
	env = env.split('_SHELL_ENV_DELIMITER_')[1];
	const ret: ShellEnvVarsInternal = {};

	for (const line of stripAnsi(env).split('\n').filter((line: string) => Boolean(line))) {
		const [key, ...values] = line.split('=');
		ret[key] = values.join('=');
	}

	return ret;
};

export async function shellEnv(shell?: string, timeout?: number): Promise<ShellEnvVars> {
	if (process.platform === 'win32') {
		return process.env;
	}

	timeout ??= 0;

	let subprocess: execa.ExecaReturnValue<string>;

	try {
		subprocess = await execa(shell || defaultShell, args, {env, timeout});
		return parseEnv(subprocess.stdout);
	} catch (error) {
		if (shell || subprocess.timedOut) {
			throw error;
		} else {
			return process.env;
		}
	}
};
