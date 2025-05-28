class CreateVotes < ActiveRecord::Migration[7.2]
  def change
    create_table :votes do |t|
      t.references :poll, null: false, foreign_key: true
      t.string :option

      t.timestamps
    end
  end
end
