<!-- src/lib/components/Spreadsheet.svelte -->
<script lang="ts">
	import type { SpreadsheetState } from '$lib/tutorial/engine/spreadsheet';
	import { colToLetter } from '$lib/tutorial/engine/spreadsheet';

	let {
		grid,
		oncellchange
	}: {
		grid: SpreadsheetState;
		oncellchange: (row: number, col: number, value: string) => void;
	} = $props();

	let editingCell = $state<{ row: number; col: number } | null>(null);
	let editValue = $state('');

	function startEdit(row: number, col: number) {
		editingCell = { row, col };
		editValue = grid.cells[row][col].raw;
	}

	function commitEdit() {
		if (editingCell) {
			oncellchange(editingCell.row, editingCell.col, editValue);
			editingCell = null;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			commitEdit();
		} else if (e.key === 'Escape') {
			editingCell = null;
		}
	}

	function displayValue(computed: string | number | null): string {
		if (computed === null) return '';
		if (typeof computed === 'number') return String(computed);
		return computed;
	}
</script>

<div data-testid="spreadsheet" class="overflow-auto rounded border border-gray-700">
	<table class="w-full border-collapse text-sm">
		<thead>
			<tr>
				<th class="w-10 border border-gray-700 bg-gray-800 px-2 py-1 text-center text-gray-500">
				</th>
				{#each { length: grid.cols } as _col, c (c)}
					<th
						class="min-w-[80px] border border-gray-700 bg-gray-800 px-2 py-1 text-center font-medium text-gray-400"
					>
						{colToLetter(c)}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each grid.cells as row, r (r)}
				<tr>
					<td
						class="border border-gray-700 bg-gray-800 px-2 py-1 text-center text-xs text-gray-500"
					>
						{r + 1}
					</td>
					{#each row as cell, c (c)}
						<td
							data-testid="cell-{r}-{c}"
							class="border border-gray-700 px-0 py-0"
							ondblclick={() => startEdit(r, c)}
						>
							{#if editingCell?.row === r && editingCell?.col === c}
								<input
									type="text"
									data-testid="cell-input-{r}-{c}"
									bind:value={editValue}
									onblur={commitEdit}
									onkeydown={handleKeydown}
									class="w-full bg-blue-900/30 px-2 py-1 text-white outline-none"
								/>
							{:else}
								<button
									type="button"
									data-testid="cell-btn-{r}-{c}"
									class="w-full cursor-cell px-2 py-1 text-left text-gray-200"
									onclick={() => startEdit(r, c)}
								>
									{displayValue(cell.computed)}&nbsp;
								</button>
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
